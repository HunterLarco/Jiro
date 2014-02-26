Getting Started
====

###Setting Up The Server
 > **Note** · If you plan to use the Jiro Entry Point you may skip this step.
 
 Before you can begin to use JiroJS, you must setup your server.
 
 1. Navigate to [Google App Engine](appengine.google.com) and create a new project.
 2. Download the [App Engine Python SDK](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_Python) if you don't already have it
> Skip step 3 if you already have a project coded.
 3. Copy the basic Jiro server [template](./Resources/ServerTemplate.zip).
 4. Copy the unzipped [JiroPY Server Module](./Resources/JiroPY.zip) into the server's root directory
 5. Add the following handler into your app.yaml file

```yaml
- url: /jirohandle/.*
  script: Jiro/Handle.app
```

###Connecting