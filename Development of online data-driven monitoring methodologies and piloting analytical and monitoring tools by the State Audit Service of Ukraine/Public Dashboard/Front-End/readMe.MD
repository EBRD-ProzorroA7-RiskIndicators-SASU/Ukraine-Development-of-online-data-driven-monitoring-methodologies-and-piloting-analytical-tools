To create a project build:
1. nodejs - v10.23.0
2. Add the host of the backend server REACT_APP_API_URL= (example "REACT_APP_API_URL=http://example.com") to the ".env.production" file. If the file does not exist, then create it in the root of the project
3. In the root of the project folder, run the "npm install" command (wait until all libraries are installed)
4. In the root of the project folder, run the "npm run build" command (the "build" folder should be created in the root).
5. Move files from the "build" folder to the desired location (Virtualhost)
6. For "VitrualHost" (apache / nginx) add the redirect setting of all urls to index.html

Example:

-=apache=-

<VirtualHost *:80>

        <Directory "/home/build">
            FallbackResource /index.html
        </Directory>

</VirtualHost>

-=nginx=-
locatiom / {
   try_files $uri $uri /index.html;
}

