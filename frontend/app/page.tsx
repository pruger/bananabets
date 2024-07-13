"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Image,
} from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title } from "@/components/primitives";

interface ProjectTileProps {
  title: string;
  description: string;
  image: string;
  onSelect: () => void;
  selected: boolean;
  selectDisabled: boolean;
}

const ProjectTile: React.FC<ProjectTileProps> = ({
  title,
  description,
  image,
  onSelect,
  selected,
  selectDisabled,
}) => (
  <Card className="py-4 w-64 h-96">
    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <h4 className="font-bold text-large">{title}</h4>
      <small className="text-default-500">{description}</small>
    </CardHeader>
    <CardBody className="overflow-visible py-2">
      <Image
        alt="Card background"
        className="object-cover rounded-xl"
        src={image}
        width={270}
      />
    </CardBody>
    <CardFooter>
      <Checkbox
        isDisabled={selectDisabled}
        isSelected={selected}
        onChange={onSelect}
      >
        Finalist?
      </Checkbox>
    </CardFooter>
  </Card>
);

export default function Home() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://predictionmarketapi.cleartxn.xyz/projects",
      ).then((res) => res.json());

      setProjects(res);
    })();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center h-full gap-4">
      <div className="absolute bottom-0 left-0 flex w-full items-center justify-center z-50 p-4 bg-gradient-to-t from-green-500">
        <Button className="w-full cursor-pointer" color="primary" size="md">
          Submit - {selectedProjects.length} / 10
        </Button>
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="inline-block max-w-lg text-center">
          <h1 className={title({ color: "violet" })}>{siteConfig.name}</h1>
          <br />
          <span>websites regardless of your design experience.</span>
        </div>
      </div>
      <Input
        isClearable
        placeholder="Search..."
        startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
      />
      <div className="flex gap-4 h-full flex-wrap overflow-y-scroll justify-center pb-20">
        {projects.map((project: any) => (
          <ProjectTile
            key={project.name}
            description={project.description}
            image={project.image}
            selectDisabled={
              selectedProjects.length >= 10 &&
              !selectedProjects.includes(project.name)
            }
            selected={selectedProjects.includes(project.name)}
            title={project.name}
            onSelect={() => {
              setSelectedProjects((prevSelectedProjects) =>
                prevSelectedProjects.includes(project.name)
                  ? prevSelectedProjects.filter((p) => p !== project.name)
                  : [...prevSelectedProjects, project.name]
              );
            }}
          />
        ))}
      </div>
    </section>
  );
}
