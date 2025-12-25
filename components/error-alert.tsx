import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorAlertProps {
  error: string
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  )
}
