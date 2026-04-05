package com.dochub.dto;

public class ShareLinkResponse {
    private String url;
    private Boolean isPublic;
    private Boolean shareEnabled;

    public ShareLinkResponse() {
    }

    public ShareLinkResponse(String url, Boolean isPublic, Boolean shareEnabled) {
        this.url = url;
        this.isPublic = isPublic;
        this.shareEnabled = shareEnabled;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Boolean getShareEnabled() {
        return shareEnabled;
    }

    public void setShareEnabled(Boolean shareEnabled) {
        this.shareEnabled = shareEnabled;
    }
}
