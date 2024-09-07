import { useNavigate } from "react-router-dom";
import { Project } from "../models/types";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      key={project.id}
      onClick={() => {
        navigate(`/projects/${project.id}/tasks`);
      }}
      className="rounded p-3 hover:shadow-lg ease-in-out border shadow-md bg-white border-white w-full flex flex-col gap-y-2 hover:cursor-pointer"
    >
      <div className="w-full flex align-middle justify-between">
        <h3 className="text-primary font-semibold text-sm">{project.title}</h3>
        <span className="text-gray-500 font-semibold text-xs">
          {project.tasks?.length} tasks
        </span>
      </div>

      <p className="text-gray-500 text-sm">{project.description}</p>
    </div>
  );
};

export default ProjectCard;
