import { FaRegCopyright } from 'react-icons/fa6'
import { text } from './ui/text'

function Footer() {
  return (
    <footer className="flex items-center justify-center h-[5vh]">
      <a href="https://5lsolutions.com/">
        <div
          className={text({
            variant: 'footer',
            class: 'flex',
            style: 'underline',
          })}
        >
          <div className=" flex gap-1 pr-1">
            Copyright <FaRegCopyright />
          </div>
          <div className="text-primary">
            5L Solutions Supply's & Allied Services Inc.
          </div>
        </div>
      </a>
    </footer>
  )
}

export default Footer
