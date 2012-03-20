# requirements
 - [jsdoc-toolkit](https://code.google.com/p/jsdoc-toolkit/)

# procedure
 
 1. remove the `web/js/ext` directory from wobble, because it contains external sources, that we don't want do create documentation for  
 `rm -r web/js/ext`
 1. also remove the old documentation  
 `rm -r docs/jsdoc`
 1. download the [jsdoc-toolkit](https://code.google.com/p/jsdoc-toolkit/)
 1. extract the zip filesomewhere on your disc
 1. change into that directory
 1. `cd jsdoc-toolkit`
 1. make sure you replace `<path to wobble>` with the path of youre local wobble copy. Then run:  
 `java -jar jsrun.jar app/run.js -r=10 -a -t=templates/jsdoc <path to wobble>/web/js/`
 1. `cp out/jsdoc <path to wobble>/doc/jsdoc`
 1. commit the new doc to git
 1. don't forget to `git co web/js` so all the ext files are restored