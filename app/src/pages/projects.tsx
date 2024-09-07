import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useStore } from "../models/useStore";
// import LogoHeader from "../components/logo-header";
import ProjectCard from "../components/project-card";

interface ProjectProps {}

const AdminProjects: React.FC<ProjectProps> = () => {
  const { getProjects, projects } = useStore();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      await getProjects().then(() => {
        setIsLoaded(true);
      });
    };

    loadProjects();
  }, [getProjects]);

  return (
    <Layout>
      {/* <LogoHeader /> */}
      <div className="p-4 flex flex-col gap-y-3 w-full">
        <h1 className="font-bold text-xl text-primary">Projects</h1>

        {isLoaded === false ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-y-4">
            {projects?.length! > 0 ? (
              projects?.map((project) => (
                <ProjectCard project={project} key={project.id} />
              ))
            ) : (
              <p className="inline-flex justify-center text-sm py-10">
                No projects found.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProjects;
