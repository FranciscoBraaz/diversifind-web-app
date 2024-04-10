import { useEffect } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import Skeleton from "react-loading-skeleton"

// Services
import { getPosts } from "../../services/postServices"
import { getUser } from "../../services/authServices"

// Utils
import { parseLocalStorageJson } from "../../utils"

// Components
import Menu from "../../components/Menu"
import NewPost from "./components/NewPost"
import Post from "../../components/Post"
import ProfileCard from "../../components/ProfileCard"
import FriendsSuggestion from "./components/FriendsSuggestion"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function PostSkeleton() {
  const skeletonsToRender = Object.keys(new Array(5).fill(null)).map(Number)

  return (
    <>
      {skeletonsToRender.map((skeleton) => (
        <div className="post__skeleton" key={skeleton}>
          <header>
            <div>
              <Skeleton
                count={1}
                style={{ width: 45, height: 45, borderRadius: "50%" }}
              />
            </div>
            <div style={{ width: "100%" }}>
              <Skeleton count={1} style={{ width: "100%", height: 35 }} />
            </div>
          </header>
          <main>
            <Skeleton count={1} style={{ width: "100%", height: 360 }} />
          </main>
          <footer>
            <div>
              <Skeleton count={1} style={{ width: "100%", height: 30 }} />
            </div>
            <div>
              <Skeleton count={1} style={{ width: "100%", height: 30 }} />
            </div>
          </footer>
        </div>
      ))}
    </>
  )
}

function SkeletonUser() {
  return (
    <div className="skeleton-user">
      <div>
        <Skeleton
          count={1}
          style={{ width: 65, height: 65, borderRadius: "50%" }}
        />
      </div>
      <div>
        <div>
          <Skeleton count={1} style={{ width: 220, height: 35 }} />
        </div>
        <div>
          <Skeleton
            count={1}
            style={{ width: 180, height: 40, marginTop: 4 }}
          />
        </div>
      </div>
      <div>
        <div>
          <Skeleton count={1} style={{ width: 200, height: 20 }} />
        </div>
        <div>
          <Skeleton
            count={1}
            style={{ width: 180, height: 20, marginTop: 4 }}
          />
        </div>
      </div>
    </div>
  )
}

function Home() {
  const user = parseLocalStorageJson("diversiFindUser")

  const {
    isLoading,
    data,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (allPages.length < lastPage.total) {
        return allPages.length + 1
      }

      return undefined
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  const {
    isLoading: isLoadingLoggedUser,
    data: dataLoggedUser,
    error: errorLoggedUser,
  } = useQuery({
    queryKey: ["logged-user-info"],
    queryFn: () => fetchLoggedInfo(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: false,
  })

  async function fetchLoggedInfo() {
    try {
      const data = await getUser(user._id)

      const formattedData = {
        _id: data._id,
        name: data.name,
        avatar: data.avatar,
        headline: data.headline,
        followers: data.followers?.length,
        following: data.following?.length,
      }

      return formattedData
    } catch (error) {
      console.error("Error fetching users: ", error)
      return []
    }
  }

  useEffect(() => {
    function infiniteScroll() {
      const scroll = window.scrollY + 80
      const height = document.body.offsetHeight - window.innerHeight

      if (scroll >= height * 0.75 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }

    window.addEventListener("scroll", infiniteScroll)
    window.addEventListener("wheel", infiniteScroll)

    return () => {
      window.removeEventListener("scroll", infiniteScroll)
      window.removeEventListener("wheel", infiniteScroll)
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  async function fetchPosts(pageParam) {
    try {
      const data = await getPosts(pageParam)

      return data
    } catch (error) {
      // console.log(error)
      return []
    }
  }

  return (
    <div className="home">
      <div className="home-container">
        <Menu />
        <main className="home__feed">
          <NewPost withAvatar withTrigger user={user} />
          {isLoading && <PostSkeleton />}
          {!isLoading && error && <p>Houve um problema ao listar postagens</p>}
          {!isLoading && data?.pages[0]?.isRandom && (
            <h6 className="home__feed__suggestions">
              Enquanto seu feed está vazio, veja algumas publicações sugeridas:
            </h6>
          )}
          {!isLoading &&
            data.pages?.map((page, pageIndex) =>
              page.posts?.map((post, postIndex) => (
                <Post
                  key={post._id}
                  src={post.media}
                  content={post.content}
                  cloudinaryId={post.cloudinaryId}
                  author={post.author}
                  mediaDescription={post.mediaDescription}
                  createdAt={post.createdAt}
                  postId={post._id}
                  pageIndex={pageIndex}
                  postIndex={postIndex}
                  postReactions={{ likes: post.likes, comments: post.comments }}
                />
              )),
            )}
        </main>
        <aside className="home__widgets-container">
          {isLoadingLoggedUser ? (
            <SkeletonUser />
          ) : (
            <ProfileCard error={errorLoggedUser} userInfo={dataLoggedUser} />
          )}
          <FriendsSuggestion />
        </aside>
      </div>
    </div>
  )
}

export default Home
