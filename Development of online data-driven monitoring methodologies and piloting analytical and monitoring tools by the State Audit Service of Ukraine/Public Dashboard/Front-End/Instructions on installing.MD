To create a project build:
- nodejs - v10.23.0
- Add the host of the backend server "export const URL=" (example "export const URL='http://example.com'") to the "/src/api/constants.js" file.
- In the root of the project folder, run the "npm install" command  (wait until all libraries are installed)
- In the root of the project folder, run the "npm run build" command (the "build" folder should be created in the root).
- Move files from the "build" folder to the desired location (Virtualhost)
- For "VitrualHost" (apache / nginx) add the redirect setting of all urls to index.html
- Example:
-=Apache=-
<VirtualHost *:80>
