# UDOIT Equal Access Accessibility Checker

**Note:** This repository is **not a fork** of IBM's Equal Access repository. Instead, it incorporates the Equal Access engine as a Git subtree. In the repository root, you will find two main directories:
- **`server/`** – Contains the Node.js server that powers the accessibility scanning service.
- **`ace-engine/`** – Contains the integrated Equal Access engine (originally the `accessibility-checker-engine` from IBM's repo), added via Git subtree.

The subtree was added using the following commands:

```bash
# In your fork of the original repository:
git subtree split --prefix=path/to/engine -b engine-only

# Create and push to a new repository for just the engine:
git push https://github.com/yourusername/ace-engine.git engine-only:main

# In your server repository, add the engine repo as a subtree:
git remote add -f upstream https://github.com/yourusername/ace-engine.git
git subtree add --prefix=ace-engine upstream main --squash
```

The integrated engine in the `ace-engine` directory has been optimized and slightly modified to meet UDOIT’s requirements. It is designed to run as a server inside a Docker container and can be deployed as a Node.js microservice. Its primary responsibility is to expose an endpoint that scans web pages and returns a report of accessibility rule compliance.

> **Important:**  
> All main development should occur on the **`ace-engine` branch**. This branch was created by integrating IBM’s Equal Access engine as a Git subtree into the `ace-engine` directory. **All changes should be made within this subtree.**

---

## Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Docker Deployment](#docker-deployment)
- [Updating from Upstream](#updating-from-upstream)
- [How It Was Created](#how-it-was-created)

---

## Overview

- **Integrated From:** IBM's Equal Access repository.
- **Purpose:** Optimize and integrate the Equal Access engine for deployment as a Dockerized Node.js microservice in the UDOIT accessibility checking system.
- **Use Case:** UDOIT is transitioning from PHP Ally to a more robust solution. This service provides an HTTP endpoint to scan web pages for accessibility, fitting seamlessly into UDOIT’s ecosystem.

---

## Repository Structure

- **`server/`**  
  Contains the Node.js server responsible for running the accessibility scanning service.

- **`ace-engine/`**  
  Contains the Equal Access engine, integrated as a Git subtree from IBM's repository. This is not a fork; it is a subtree inclusion of the `accessibility-checker-engine` directory from the upstream repository.

---

## Docker Deployment

The server is containerized for ease of deployment. It runs in a Node.js runtime and listens on a specified port to serve accessibility scanning requests.

### Building the Docker Image

Run this command in /server:

```bash
docker build --platform linux/amd64 -t ace .
```

### Running the Container

To start the container:

```bash
docker run -d --platform linux/amd64 -p 3000:3000 ace
```

---

## Updating from Upstream

This repository tracks changes from the original IBM Equal Access repository. The upstream remote points to the original repository's master branch.

### Steps to Update:

1. **Ensure the Upstream Remote is Set**

   If you haven’t already added IBM's original Equal Access repository as the upstream remote, run:

   ```bash
   git remote add -f upstream git@github.com:IBMa/equal-access.git
   git fetch upstream
   ```

2. **Pull Updates into the Subtree**

   Use the Git subtree pull command to incorporate changes from the upstream master branch into the `ace-engine` subtree:

   ```bash
   git subtree pull --prefix=ace-engine upstream master --squash
   ```

3. **Review and Merge Changes**

   After pulling in the updates, review the changes, resolve any conflicts if necessary, and commit the updates.

---

## How It Was Created

This repository was created using a multi-step process that separates the engine from the server, allowing more granular control over updates. The approach was as follows:

1. **Fork the Original Repository and Extract the Engine**
   - **Fork the Original Repo:** Start by forking IBM's Equal Access repository.
   - **Extract the Engine:** In your fork, run:
     ```bash
     git subtree split --prefix=path/to/engine -b engine-only
     git push https://github.com/yourusername/ace-engine.git engine-only:master

     ```
     This creates a branch (`engine-only`) that contains only the engine code.

2. **Set Up the Server Repository**
   - **Create the Server Repo:** Initialize a new repository for the server code.
   - **Add the Engine as a Subtree:** In the server repository, add the dedicated engine repository as a subtree:
     ```bash
     git remote add -f upstream https://github.com/yourusername/ace-engine.git
     git subtree add --prefix=ace-engine upstream master --squash
     ```

3. **Update Flow**
   - **From Original to Engine Repo:** When there are updates in the original repo, pull them into your fork, run another subtree split to update the `engine-only` branch, and push these changes to your `ace-engine` repository.
   - **From Engine Repo to Server Repo:** In the server repository, update the subtree with:
     ```bash
     git subtree pull --prefix=ace-engine upstream main --squash
     ```
   This approach creates a clear separation:
   - **Original Repo → Your Fork/Engine-Only Branch/Dedicated Engine Repository → Server Repository (via subtree)**
   
Additionally, here’s a glimpse of the initial setup commands and commit workflow from the server repository:

```bash
# In the server repository:
git add .
git commit -m "first commit:"

# Set up the remote and push the initial commit
git remote add origin git@github.com:evannaderi/equal-access-server.git
git branch -M main
git push -u origin main

# Split the engine subtree (if needed) and add it from your dedicated engine repository
git subtree split --prefix=accessibility-checker-engine -b engine-only
git remote add -f upstream git@github.com:evannaderi/ace-engine.git
git subtree add --prefix=ace-engine upstream master --squash
```

This method provides better control over what changes are propagated from the original repository while maintaining a clean separation between the server code and the engine code.
