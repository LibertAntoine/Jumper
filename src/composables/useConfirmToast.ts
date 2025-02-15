import { useToast } from '@@materials/ui/toast'

export const useConfirmToast = async <T>(
  func: () => Promise<T>,
  options: {
    errorTitle?: string
    successTitle?: string
  } = {}
): Promise<T> => {
  const { toast } = useToast()
  try {
    const result = await func()
    if (options.successTitle) {
      toast({
        title: options.successTitle
      })
    }
    return result
  } catch (error) {
    if (error instanceof Error && options.errorTitle) {
      toast({
        title: options.errorTitle,
        description: error.message,
        variant: 'destructive'
      })
    }
    return Promise.reject(error)
  }
}
