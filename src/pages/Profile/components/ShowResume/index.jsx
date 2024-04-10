import { ArrowUpRightSquare } from "lucide-react"
import Button from "../../../../components/Button"

function ShowResume({ resumeUrl }) {
  function handleOpenResume() {
    window.open(resumeUrl, "_blank")
  }

  return (
    <div>
      <Button
        styleType="outlined"
        onClick={handleOpenResume}
        style={{ width: "fit-content", height: 35, gap: 8 }}
        rightIcon={<ArrowUpRightSquare />}
      >
        Visualizar currículo
      </Button>
    </div>
  )
}

export default ShowResume
