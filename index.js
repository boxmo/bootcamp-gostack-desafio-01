const express = require("express");
const server = express();

server.use(express.json());

const projects = [];

// Global middleware
// logs requests count
server.use((req, res, next) => {
  console.count("REQUEST COUNT");
  return next();
});

// Route middleware
// Checks if params id and project are present
// Add project to req
function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  req.project = project;
  return next();
}

// Create new project
// REQUEST BODY EX. { id: "1", title: "some title" }
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);

  return res.json(project);
});

// List all projects
server.get("/projects", (req, res) => {
  return res.json({ projects });
});

// Update a project
// REQUEST BODY EX { title: "some title" }
server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { title } = req.body;

  req.project.title = title;
  return res.json(req.project);
});

// Delete a project
server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const projectIndex = projects.indexOf(req.project);

  projects.splice(projectIndex, 1);
  return res.json({ projects });
});

// Add new task to a project
// REQUEST BODY { title: "some title" }
server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

// Start server
server.listen(3333);
