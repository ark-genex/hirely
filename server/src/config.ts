export class Config {

  constructor() {
    switch(process.env.NODE_ENV){
      case 'production':
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY",
            clientSecret: "application data is my life",
            url: "https://sso.hirely.com/oauth2.0",
            nodeBaseURL: "https://hirely.com",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 3005,
            rootContext: '/ui',
            logPath: '/applogs/hirely'
          },
          urls: {
            hirely: 'https://hirely.com',
            sso: 'https://sso.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          }
        };

      case 'sbx':
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY SBX",
            clientSecret: "application data is my life",
            url: "https://ssoqas.hirely.com/oauth2.0",
            nodeBaseURL: "https://snd.hirely.com",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 3007,
            rootContext: '/ui',
            logPath: '/applogs/hirely/sbx'
          },
          urls: {
            hirely: 'https://snd.hirely.com',
            sso: 'https://ssoqas.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          },
          clientLogger: {
            flushInterval: 600000, // 10 mins
            maxLogLength: 10000,
            isDebugEnabled: true,
            enableLogService: true
          },
          googlemaps: {
            enabled: true,
            clientId: 'AIzaSyBx5XGGSNfkc_nODEPsInQMg7iZKcbd6BE',
            url: 'https://maps.googleapis.com/maps',
            scriptEndpoint: 'https://maps.googleapis.com/maps/api/js'
          }
        };

      case 'qas':
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY QAS",
            clientSecret: "application data is my life",
            url: "https://ssoqas.hirely.com/oauth2.0",
            nodeBaseURL: "https://qas.hirely.com",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 3008,
            rootContext: '/ui',
            logPath: '/applogs/hirely/qas'
          },
          urls: {
            hirely: 'https://qas.hirely.com',
            sso: 'https://ssoqas.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          },
          clientLogger: {
            flushInterval: 600000, // 10 mins
            maxLogLength: 10000,
            isDebugEnabled: true,
            enableLogService: true
          },
          googlemaps: {
            enabled: true,
            clientId: 'AIzaSyBx5XGGSNfkc_nODEPsInQMg7iZKcbd6BE',
            url: 'https://maps.googleapis.com/maps',
            scriptEndpoint: 'https://maps.googleapis.com/maps/api/js'
          }
        };

      case 'development':
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY DEV",
            clientSecret: "application data is my life",
            url: "https://ssodev.hirely.com/oauth2.0",
            nodeBaseURL: "https://dev.hirely.com",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 5004,
            rootContext: '/ui',
            logPath: '/applogs/hirely/dev'
          },
          urls: {
            hirely: 'https://dev.hirely.com',
            sso: 'https://ssodev.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          },
          clientLogger: {
            flushInterval: 600000, // 10 mins
            maxLogLength: 10000,
            isDebugEnabled: true,
            enableLogService: true
          },
          googlemaps: {
            enabled: true,
            clientId: 'AIzaSyBx5XGGSNfkc_nODEPsInQMg7iZKcbd6BE',
            url: 'https://maps.googleapis.com/maps',
            scriptEndpoint: 'https://maps.googleapis.com/maps/api/js'
          }
        };

      case 'ci':
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY CI",
            clientSecret: "application data is my life",
            url: "https://ssodev.hirely.com/oauth2.0",
            nodeBaseURL: "https://ci.hirely.com",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 5003,
            rootContext: '/ui',
            logPath: '/applogs/hirely/ci'
          },
          urls: {
            hirely: 'https://ci.hirely.com',
            sso: 'https://ssodev.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          },
          clientLogger: {
            flushInterval: 600000, // 10 mins
            maxLogLength: 10000,
            isDebugEnabled: true,
            enableLogService: true
          },
          googlemaps: {
            enabled: true,
            clientId: 'AIzaSyBx5XGGSNfkc_nODEPsInQMg7iZKcbd6BE',
            url: 'https://maps.googleapis.com/maps',
            scriptEndpoint: 'https://maps.googleapis.com/maps/api/js'
          }
        };

      default:
        return {
          application: {
            name: 'HIRELY'
          },
          oauth: {
            clientID: "HIRELY Local",
            clientSecret: "application data is my life",
            url: "https://ssodev.hirely.com/oauth2.0",
            autoLogoutOnSessionExpired: "true"
          },
          server: {
            port: 3005,
            rootContext: '/ui',
            logPath: __dirname + '/logs'
          },
          urls: {
            hirely: 'https://dev.hirely.com',
            sso: 'https://ssodev.hirely.com'
          },
          ga: {
            id: ''
          },
          dynatrace: {
            enabled: false
          },
          clientLogger: {
            flushInterval: 600000, // 10 mins
            maxLogLength: 10000,
            isDebugEnabled: true,
            enableLogService: true
          },
          googlemaps: {
            enabled: true,
            clientId: 'AIzaSyBx5XGGSNfkc_nODEPsInQMg7iZKcbd6BE',
            url: 'https://maps.googleapis.com/maps',
            scriptEndpoint: 'https://maps.googleapis.com/maps/api/js'
          }
        };
    }
  }
}