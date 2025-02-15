export interface AuthConfig {
    scimEnabled: boolean,
    providers: AuthProvider[],
}

export interface AuthProvider {
    id: "oidc" | "email",
    name: string,
    authUrl: string,
    logoutUrl?: string,
}