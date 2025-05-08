import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const IconExample = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4">
      {/* Solid icons */}
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon="plus" className="text-primary" />
        <span>Add</span>
      </div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon="trash" className="text-red-500" />
        <span>Delete</span>
      </div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon="check" className="text-green-500" />
        <span>Complete</span>
      </div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon="edit" className="text-blue-500" />
        <span>Edit</span>
      </div>

      {/* Brand icons */}
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={['fab', 'github']} className="text-gray-800" />
        <span>GitHub</span>
      </div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={['fab', 'twitter']} className="text-blue-400" />
        <span>Twitter</span>
      </div>
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-blue-600" />
        <span>LinkedIn</span>
      </div>
    </div>
  )
}

export default IconExample 