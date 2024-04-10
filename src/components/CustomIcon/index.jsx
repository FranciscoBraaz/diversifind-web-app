import * as FeatherIcons from "lucide-react"

const CustomIcon = ({ icon, ...props }) => {
  const Icon = FeatherIcons[icon]

  return <Icon {...props} />
}

export default CustomIcon
