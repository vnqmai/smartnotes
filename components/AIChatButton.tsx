import { Bot } from "lucide-react"
import { Button } from "./ui/button"

interface IAIChatButtonProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const AIChatButton = ({ isOpen, setIsOpen }: IAIChatButtonProps) => {
  return (
    <Button onClick={() => setIsOpen(!isOpen)}>
      <Bot size={20} className="mr-2" />
    </Button>
  )
}

export default AIChatButton