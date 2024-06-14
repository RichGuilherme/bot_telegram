import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
)

export const authService = {
    generateAuthUrl: () => {
        return oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/tasks'
        })
    },

    getToken: (code: string) => {
        return new Promise((resolve, reject) => {
            oauth2Client.getToken(code, (err, tokens) => {
                if (err) {
                    reject(err)
                } else {
                    if (!tokens) {
                        reject("Token invalido!")
                        return
                    }

                    oauth2Client.setCredentials(tokens)
                    resolve(tokens)
                }
            })
        })
    }
}

export { oauth2Client }