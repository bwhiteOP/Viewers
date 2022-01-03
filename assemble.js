/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 26, 2020 by PoyangLiu
 */

/**
 * This script assembles the build output for production
 */

const fs = require('fs');
const ncp = require('ncp');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const path = require('path');

const target = process.argv[2];

const buildRoot = path.resolve(__dirname, './build');
const rootPackage = require('./package.json');

// Read the actual version from the version file
let { version } = rootPackage;
if (fs.existsSync(`${buildRoot}/version.txt`)) {
    version = fs.readFileSync(`${buildRoot}/version.txt`).toString();
}

mkdirp.sync(buildRoot);

if (target === 'version')
{
    // Generates a version.txt file based on the root package.json
    console.log('Version:', rootPackage.version);
    fs.writeFileSync(`${buildRoot}/version.txt`, `${rootPackage.version}`);
}
else if (target === 'core')
{
    // Copy the packages/core directory to build root.
    const buildCore = path.resolve(buildRoot, './core');
    rimraf.sync(buildCore);
    ncp(
        path.resolve(__dirname, './OnePacsWebViewer/packages/core/'),
        buildCore
    );
}
else if (target === 'viewer')
{
    // Copy the viewers dist to build root.
    const buildViewer = path.resolve(buildRoot, './viewer');
    rimraf.sync(buildViewer);

    ncp(
        path.resolve(__dirname, './OhifWebViewer/platform/viewer/dist/'),
        buildViewer,
        function () {
            ncp(
                path.resolve(__dirname, './OnePacsWebViewer/packages/viewer/public'),
                buildViewer,
                function () {
                    setTimeout(() => {
                        updateAppInfo(
                            path.resolve(buildViewer, './manifest.json'),
                            version
                        );
                        updateAppInfo(
                            path.resolve(buildViewer, './assets/manifest.webapp'),
                            version
                        );
                    }, 100);
                }
            );
        }
    );
}
else if (target === 'server')
{
    // Copy the server dist to build root.
    const buildServer = path.resolve(buildRoot, './server');
    rimraf.sync(buildServer);
    ncp(
        path.resolve(__dirname, './OnePacsWebViewer/server/dist/'),
        buildServer,
        function (err) {
            // Update built server appInfo.json based on package.json
            updateAppInfo(
                path.resolve(buildRoot, './server/appInfo.json'),
                version
            );
        }
    );

    // Copy the server package.json to the build folder, update with version
    copyServerPackageJson(
        path.resolve(__dirname, './OnePacsWebViewer/server/package.json'),
        path.resolve(buildRoot, './package.json'),
        version
    );
}

function updateAppInfo(appInfoFile, version) {
    const appInfo = JSON.parse(fs.readFileSync(appInfoFile));
    if (appInfo.name)
        appInfo.name = rootPackage.name;

    if (appInfo.short_name)
        appInfo.short_name = rootPackage.name;

    if (appInfo.description)
        appInfo.description = rootPackage.description;

    if (appInfo.author)
        appInfo.author = rootPackage.author;

    if (appInfo.version)
        appInfo.version = version || rootPackage.version;

    fs.writeFileSync(appInfoFile, JSON.stringify(appInfo, null, 2));
}

function copyServerPackageJson(sourceFile, destFile, version) {
    const packageJson = require(sourceFile);
    delete packageJson.scripts;
    delete packageJson.devDependencies;
    delete packageJson.main;
    delete packageJson.files;

    packageJson.name = rootPackage.name;
    packageJson.version = version || rootPackage.version;
    packageJson.description = rootPackage.description;
    packageJson.workspaces = [
        'core',
        'server'
    ];
    packageJson.scripts = {
        start: 'node ./server/index.js'
    };
    
    fs.writeFileSync(destFile, JSON.stringify(packageJson, null, 2));
}
