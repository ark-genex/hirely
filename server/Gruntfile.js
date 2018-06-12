module.exports = function (grunt) {

  grunt.file.preserveBOM = true;
  grunt.file.defaultEncoding = 'utf8';

  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks("grunt-tslint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks('grunt-replace');

  // Default tasks.
  grunt.registerTask("serve", ["concurrent:watchers"]);
  // grunt.registerTask('default', ["tslint:all", "ts:build", "copy:build"]);


  // Default task, so if you just run 'grunt', this is what it will do
  grunt.registerTask('default', ['build']);

  // General build task, for dev only
  grunt.registerTask('build', [
    'tslint:all',
    'ts:build',
    'clean:preBuild',
    'copy:npmrc',
    'clean:postBuild',
    'replace'/*,
    'coverage'*/
  ]);

  // Release build for production
  grunt.registerTask('release', [
    'clean:preBuild',
    'js',
    'concat:prod',
    'copy',
    'clean:postBuild'/*,
    'coverage'*/
  ]);

  // Utility tasks, these are primarily used by the watchers and the dev build
  //grunt.registerTask('css', ['clean:css', 'compass:dev', 'copy:css', 'copy:cssFonts']);
  grunt.registerTask('js', ['jshint','clean:js']);

  // Print a timestamp, this help you determine the last build
  // with a quick glance at the terminal
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(new Date());
  });

  grunt.packageInfo = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/!*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
    '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*!/\n',

    src: {
      ts: ['src/!**!/!*.ts'],
      i18n: [ 'src/locale/!**!/!*.ts'],
      specs: ['src/test/!**!/!*.spec.ts'],
      scenarios: ['src/test/!**!/!*.scenario.ts']
    },

    clean: {
      preBuild: ['<%= distdir %>/!*'],
      postBuild: ['<%= distdir %>/temp'], //,'<%= distdir %>/templates'],
      ts: ['<%= distdir %>/scripts']
    },

    nodemon: {
      dev: {
        script: 'src/hirely-server.js'
      },
      options: {
        ignore: ['node_modules/**', 'Gruntfile.js'],
        env: {
          PORT: '3005'
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/hirely-server.js', '!node_modules/**/*.ts'], // the watched files
        tasks: ["newer:tslint:all", "ts:build"], // the task to run
        options: {
          spawn: false // makes the watch task faster
        }
      }
    },

    concurrent: {
      watchers: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    tslint: {
      options: {
        configuration: grunt.file.readJSON("src/tslint.json")
      },
      all: {
        src: ["src/**.*", "!node_modules/**/*.ts", "!obj/**/*.ts", "!typings/**/*.ts"] // avoid linting typings files and node_modules files
      }
    },

    ts: {
      build: {
        src: ["src/hirely-server.ts", "!node_modules/**/*.ts"], // Avoid compiling TypeScript files in node_modules
        options: {
          module: 'commonjs', // To compile TypeScript using external modules like NodeJS
          fast: 'never' // You'll need to recompile all the files each time for NodeJS
        }
      }

      /*build: {
        files: [{
          src: ["src/!**!/!*.ts", "!src/.baseDir.ts"],
          dest: '../<%= distdir %>'
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: false,
          rootDir: "src"
        }
      }*/
    },

    replace:{
      dist: {
        options: {
          patterns: [
            {
              match: 'APP_LOCATION',
              replacement: '/../../client/dist'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src : ['src/hirely-server.js'], dest: '<%= distdir %>'}
        ]
      }/*,
      parentDist: {
        options: {
          patterns: [
            {
              match: 'APP_LOCATION',
              replacement: '/app'
            }
          ]
        },
        files: [
          {dest: '../<%= distdir %>', src : ['src/hirely-server.js'], expand: true, flatten: true}
        ]
      }*/
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "./src",
            src: ["**"],
            dest: '<%= distdir %>'
          }
        ]
      },
      npmrc: {
        files: [
          {dest: '<%= distdir %>', src : '.npmrc', expand: true, cwd: '.'}
        ]
      }
    }
  });
};


/*
module.exports = function(grunt) {

  grunt.file.preserveBOM = true;
  grunt.file.defaultEncoding = 'utf8';

  // Load all of our NPM tasks
  // Make sure you add the task package to the 'package.json' file
  // and run 'npm install' before you add the package here
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);

  // Default task, so if you just run 'grunt', this is what it will do
  grunt.registerTask('default', ['build']);

  // General build task, for dev only
  grunt.registerTask('build', [
    'clean:preBuild',
    'js',
    'copy:assets',
    'copy:npmrc',
    'clean:postBuild',
    'copy:projectToParent',
    'replace'/!*,
     'coverage'*!/
  ]);

  // Release build for production
  grunt.registerTask('release', [
    'clean:preBuild',
    'js',
    'concat:prod',
    'copy',
    'clean:postBuild',
    'coverage'
  ]);



  // Utility tasks, these are primarily used by the watchers and the dev build
  //grunt.registerTask('css', ['clean:css', 'compass:dev', 'copy:css', 'copy:cssFonts']);
  grunt.registerTask('js', ['jshint','clean:js']);

  // Print a timestamp, this help you determine the last build
  // with a quick glance at the terminal
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(new Date());
  });

  grunt.packageInfo = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/!*! <%= pkg.title || pkg.name %> - version:<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>' +
    '<%= pkg.homepage ? " * " + pkg.homepage : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*!/\n',

    src: {
      js: ['src/!**!/!*.js'],
      i18n: [ 'src/locale/!**!/!*.js'],
      specs: ['src/test/!**!/!*.spec.js'],
      scenarios: ['src/test/!**!/!*.scenario.js']
    },

    clean: {
      preBuild: ['<%= distdir %>/!*'],
      postBuild: ['<%= distdir %>/temp'], //,'<%= distdir %>/templates'],
      js: ['<%= distdir %>/scripts']
    },

    copy: {
      assets: {
        files: [
          {dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src'},
          {dest: '<%= distdir %>', src : 'package.json', expand: true, cwd: '.'},
          {dest: '<%= distdir %>/scripts', src : '**', expand: true, cwd: 'vendor'}

        ]
      },
      npmrc: {
        files: [
          {dest: '<%= distdir %>', src : '.npmrc', expand: true, cwd: '.'}
        ]
      },
      projectToParent: {
        files: [
          {dest: '../<%= distdir %>', src : '**', expand: true, cwd: '<%= distdir %>'},
          {dest: '../<%= distdir %>', src : '.npmrc', expand: true, cwd: '<%= distdir %>'}
        ]
      }
    },

    watch:{
      js: {
        files: ['<%= src.js %>'],
        tasks: ['js', 'timestamp']
      }
    },

    jshint:{
      files:[
        'Gruntfile.js',
        '<%= src.js %>',
        '<%= src.scenarios %>',
        '<%= src.i18n %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporterOutput: ''
      }
    },

    replace:{
      dist: {
        options: {
          patterns: [
            {
              match: 'APP_LOCATION',
              replacement: '/../../client/dist'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src : ['src/hirely-server.js'], dest: '<%= distdir %>'}
        ]
      },
      parentDist: {
        options: {
          patterns: [
            {
              match: 'APP_LOCATION',
              replacement: '/app'
            }
          ]
        },
        files: [
          {dest: '../<%= distdir %>', src : ['src/hirely-server.js'], expand: true, flatten: true}
        ]
      }
    },

    mocha_istanbul: {
      coverage: {
        src: 'test', // a folder works nicely
        options: {
          mask: '**!/!*.spec.js',
          require: ['test/mocha.env.js']
        }
      }
    }

  });

  grunt.event.on('coverage', function(lcovFileContents, done){
    // Check below on the section "The coverage event"
    done();
  });
};
*/
