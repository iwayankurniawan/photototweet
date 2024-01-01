import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
import GoogleProvider from "next-auth/providers/google";


const config: DynamoDBClientConfig = {
    credentials: {
        accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
    },
    region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
    marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
})

export const authOptions: any = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile: any): any {
                // use at your own risk
                return {
                    id: profile.sub,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    email: profile.email,
                    credits: 5
                };
            }

        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
            version: "2.0",
            profile(profile: any): any {
                // use at your own risk
                return {
                    id: profile.sub,
                    name: profile.name,
                    firstname: profile.given_name,
                    lastname: profile.family_name,
                    email: profile.email,
                    credits: 5
                };
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    adapter: DynamoDBAdapter(
        client
    ),
    callbacks: {
        async session({ session , user }:any) {
            // Send properties to the client, like an access_token and user id from a provider.
            
            session.id = user.id
            session.credits = user.credits

            return session
        }
    }
}

export default NextAuth(authOptions)
