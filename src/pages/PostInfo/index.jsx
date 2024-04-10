import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import Skeleton from "react-loading-skeleton"

// Services
import { getCommentsFromPost, getPost } from "../../services/postServices"

// Components
import Menu from "../../components/Menu"
import Post from "../../components/Post"

// Styles
import "./index.scss"
import "react-loading-skeleton/dist/skeleton.css"

function PostSkeleton() {
  return (
    <div className="post__skeleton">
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
        <Skeleton count={1} style={{ width: "100%", height: 300 }} />
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
  )
}

function PostInfo() {
  const { id } = useParams()

  const {
    isLoading: postIsLoading,
    data: postData,
    error: postError,
  } = useQuery({
    queryKey: ["post-info", id],
    queryFn: () => fetchPostInfo(),
    staleTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const {
    isLoading: commentsIsLoading,
    data: commentsData,
    error: commentsError,
  } = useQuery({
    queryKey: ["post-comments", id],
    queryFn: () => fetchPostComments(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    retry: false,
  })

  async function fetchPostInfo() {
    try {
      const { post } = await getPost(id)

      return post
    } catch (error) {
      // console.log(error)
      return {}
    }
  }

  async function fetchPostComments() {
    try {
      const { comments } = await getCommentsFromPost(id)

      return comments
    } catch (error) {
      // console.log(error)
      return []
    }
  }

  if (postError || commentsError) return <div>{postError.message}</div>

  return (
    <div className="post-info">
      <div className="container-page">
        <Menu />
        {(postIsLoading || commentsIsLoading) && <PostSkeleton />}
        {!postIsLoading && !commentsIsLoading && !_.isEmpty(postData) && (
          <main>
            <Post
              src={postData.media}
              content={postData.content}
              author={postData.author}
              createdAt={postData.createdAt}
              postId={postData._id}
              postReactions={{
                likes: postData.likes,
                comments: postData.comments,
              }}
              comments={commentsData}
              canComment
            />
          </main>
        )}
      </div>
    </div>
  )
}

export default PostInfo
