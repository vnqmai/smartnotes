import { Circle } from "lucide-react"
import { Button } from "./ui/button"

interface ILoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean
}

const LoadingButton = ({ isLoading, disabled, children , ...props }: ILoadingButtonProps) => {
  return <Button {...props} disabled={disabled || isLoading}>
    {isLoading && <Circle className="mr-2 animate-spin w-4 h-4" />}
    {children}
  </Button>
}

export default LoadingButton