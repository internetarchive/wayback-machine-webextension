# Contribution guide

## What do I need to know to help?

There can be multiple ways in which you can help us improve the project from what it is today. Before you begin, we would encourage you to start exploring the extension, to understand more about the project. Once you are done, you can begin contributing with code, with content or simply by giving us ideas.

### Contributing code

The Chrome extension is built using with Node.js on the top of HTML , CSS and JavaScript and JQuery. Other than that, we use git for version control, so knowledge of git would come handy.

### Contributing content / documentation

In order to add documentation for the project, you need to have some understanding about the project, and decent technical writing skills.
However, if you do not understand certain things about the project, the community will always be there to help you.

### Finding Bugs / Giving feature ideas

This is the easiest way of helping us with the project. You are encouraged to try out the latest development version, explore different features, and find out if there are any bugs. You can also brainstorm feature ideas, and share them with us.

To share either bug or features, [create an issue here](https://github.com/internetarchive/wayback-machine-webextension/issues/new/choose), and we can continue the rest of the discussion there.

## How to set up the development environment?

Before we begin, if you don't already have, download [git](https://git-scm.com/downloads ) and [node.js](https://nodejs.org/en/download/ ). You may look at relevant tutorials to set them up according to your operating system.

 - Open the [wayback machine browser extension GitHub page](https://github.com/internetarchive/wayback-machine-webextension/ ) and fork the project.
 - Open the terminal and navigate to the directory where you wish to clone the project using   
    `cd <Address-to-the-directory>`
 - Clone the project and navigate to working directory by typing the commands
    `git clone https://github.com/<github_account_name>/wayback-machine-webextension.git`   
    `cd wayback-machine-webextension`
 - Install the required packages by typing the command:   
    `npm install`
 - Now you have a `node_modules` directory populated with packages.

## How to install developer version of the extension?

Once you have cloned the repository to your local machine (this would work with both the original and the forked repositories, but if you wish to make changes, you need to clone the forked version), you can follow the guide at [README.md](https://github.com/internetarchive/wayback-machine-webextension/blob/master/README.md )


## How to contribute code and docs?

### Find / Create an Issue to work on

 - Explore the [issues section](https://github.com/internetarchive/wayback-machine-webextension/issues ) on the repository.
 - Go through open issues, read comments, talk to people and finalize an issue, you can work on, and get yourself assigned to the issue.
 - Alternatively, if you notice any bug, or have any feature idea, you can create an issue, and discuss with code maintainers, and get yourself assigned to the issue.

### Write the code / docs

 - Head over to the forked repository.
 - Open an existing file, or create a new file.
 - Make changes and save the files.
 - To write tests for `example.js`, create a new file in the test directory as `example.spec.js`
 - Run tests by typing:  
`npm test`
 - Read the [Testing Guide](TESTING_GUIDE.md) for details.

### Push the changes to GitHub

 - Open your git terminal
 - Create a new branch for every feature you add, or every set of bugs you fix and more to that branch using  
`git branch <branch-name>` (Please use meaningful branch names)  
`git checkout <branch-name>`
 - Now add the files which you have made changes to using  
`git add <filename1> <filename2>` or `git add -A` for all the changed files
 - Create a commit and write a meaningful commit message using  
`git commit -m "<commit-message>"`  
To learn how to write a good commit message, please see [https://chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
 - Push the changes to the repository using  
`git push -u origin <branch-name>`
 - Open the main GitHub repository, and create a Pull Request. (You will see an option when you open the repository)
 - Review the PR title, and make it meaningful. For example  
`"Fix 399: Popup background now Black"`


## Recommended standard practices

Here are a set of rules, you are advised to follow, to ensure smooth workflow.

 - Inform and talk to the community, before working on an issue.
 - Always write meaningful commit messages.
 - Only commit complete and well tested code.
 - Follow the [Style Guide](https://github.com/internetarchive/wayback-machine-webextension/blob/master/STYLE_GUIDE.md).
 - Make small commits - Add different commits for different changes.
 - Don't push straight to master. Create a separate branch (with a meaningful name) for each feature or bug you work on.
 - Avoid working on outdated forks. Follow these tutorials on [configuring a remote](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork), and [syncing a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork)
 - For major changes, increment the version number on `manifest.json`
 - Make sure all tests pass. Follow the [Testing Guide](TESTING_GUIDE.md) for details.

If you have any queries, feel free to create issues to discuss about them. Looking forward to your contribution.
