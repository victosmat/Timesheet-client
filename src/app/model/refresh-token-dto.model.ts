export class RefreshTokenDto {
    private refreshToken: string;

    constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }
}
