import './index.css'

const Project = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="list-element">
      <img className="project-image" alt={name} src={imageUrl} />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default Project
