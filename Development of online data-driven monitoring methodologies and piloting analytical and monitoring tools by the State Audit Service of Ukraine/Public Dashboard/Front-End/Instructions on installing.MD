To create a project build:
1 nodejs - v10.23.0
2 Add the host of the backend server "export const URL=" (example "export const URL='http://example.com'") to the "/src/api/constants.js" file.
3 In the root of the project folder, run the "npm install" command  (wait until all libraries are installed)
4 In the root of the project folder, run the "npm run build" command (the "build" folder should be created in the root).
5 Move files from the "build" folder to the desired location (Virtualhost)
6 For "VitrualHost" (apache / nginx) add the redirect setting of all urls to index.html
Example:
-=Apache=-
<VirtualHost *:80>
