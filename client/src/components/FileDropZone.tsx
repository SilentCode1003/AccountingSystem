import { UseMutateFunction } from '@tanstack/react-query'
import { DownloadIcon, FileUpIcon } from 'lucide-react'
import { Dropzone } from './Dropzone'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './ui/dialog'
import { Text } from './ui/text'
import { useDownloadFile } from '@/hooks/mutations'

type CreateByFileUploadProps = {
  file: File | undefined
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  mutate: UseMutateFunction<unknown, Error, FormData, unknown>
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  fileName: string
  label: string
  template?: boolean
}

export const CreateByFileUpload = ({
  file,
  setFile,
  mutate,
  open,
  setOpen,
  fileName,
  label,
  template,
}: CreateByFileUploadProps) => {
  const download = useDownloadFile(fileName.concat('.xlsx'), '/fileformats')
  const handleSubmitFile = () => {
    const payload = new FormData()

    payload.append(fileName, file as File)

    mutate(payload)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'} className="px-2">
          <FileUpIcon className="hover:cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <div className="flex gap-4">
            <Text variant="heading3bold">Upload</Text>
            <Text variant={'label'}>{label}</Text>
          </div>
        </DialogHeader>

        <Dropzone onChange={setFile} fileExtension="xlsx" />
        {template && (
          <Button
            onClick={() => download.mutate()}
            variant={'outline'}
            className="flex gap-2"
          >
            Download Template <DownloadIcon />
          </Button>
        )}

        <Button onClick={handleSubmitFile}>Upload</Button>
      </DialogContent>
    </Dialog>
  )
}
