///<summary>Type definitions for swagger 2.0</summary>


interface SwaggerObject {
    /**
     *Specifies the Swagger Specification version being used.It can be used by the Swagger UI and other clients to interpret the API listing.The value MUST be "2.0".
     */
    swagger: string;
    /**
     *Provides metadata about the API.The metadata can be used by the clients if needed.
     */
    info: swagger.InfoObject;
    /**
     *The available paths and operations for the API.
     */
    paths: swagger.PathsObject;
    /**
     *The host(name or ip) serving the API.This MUST be the host only and does not include the scheme nor sub - paths.It MAY include a port.If the host is not included, the host serving the documentation is to be used(including the port).The host does not support path templating.
     */
    host?: string;
    /**
     *The base path on which the API is served, which is relative to the host.If it is not included, the API is served directly under the host.The value MUST start with a leading slash(/).The basePath does not support path templating.
     */
    basePath?: string;
    /**
     *The transfer protocol of the API.Values MUST be from the list: "http", "https", "ws", "wss".If the schemes is not included, the default scheme to be used is the one used to access the specification.
     */
    schemes?: Array<string>;
    /**
     *A list of MIME types the APIs can consume.This is global to all APIs but can be overridden on specific API calls.Value MUST be as described under Mime Types.
     */
    consumes?: Array<string>;
    /**
     *A list of MIME types the APIs can produce.This is global to all APIs but can be overridden on specific API calls.Value MUST be as described under Mime Types.
     */
    produces?: Array<string>;
    /**
     *Definitions Object 	An object to hold data types produced and consumed by operations.
     */
    definitions?: swagger.DefinitionsObject;
    /**
     *An object to hold parameters that can be used across operations.This property does not define global parameters for all operations.
     */
    parameters?: swagger.ParametersDefinitionsObject;
    /**
     *An object to hold responses that can be used across operations.This property does not define global responses for all operations.
     */
    responses?: swagger.ResponsesDefinitionsObject;
    /**
     *Security scheme definitions that can be used across the specification.
     */
    securityDefinitions?: swagger.SecurityDefinitionsObject;
    /**
     *A declaration of which security schemes are applied for the API as a whole.The list of values describes alternative security schemes that can be used(that is, there is a logical OR between the security requirements).Individual operations can override this definition.
     */
    security?: Array<swagger.SecurityRequirementObject>;
    /**
     *A list of tags used by the specification with additional metadata.The order of the tags can be used to reflect on their order by the parsing tools.Not all tags that are used by the Operation Object must be declared.The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
     */
    tags?: Array<swagger.TagObject>;
    /**
     *Additional external documentation.
     */
    externalDocs?: swagger.ExternalDocumentationObject;
}

declare module swagger {
    export interface InfoObject {
        /**
         *The title of the application.
         */
        title: string;
        /**
         *Provides the version of the application API (not to be confused by the specification version).
         */
        version: string;
        /**
         *A short description of the application. GFM syntax can be used for rich text representation.
         */
        description?: string;
        /**
         *The Terms of Service for the API.
         */
        termsOfService?: string;
        /**
         *The contact information for the exposed API.
         */
        contact?: ContactObject;
        /**
         *The license information for the exposed API.
         */
        license?: LicenseObject;

    }
    export interface PathsObject { }
    export interface DefinitionsObject { }
    export interface ParametersDefinitionsObject { }
    export interface ResponsesDefinitionsObject { }
    export interface SecurityDefinitionsObject { }
    export interface SecurityRequirementObject { }
    export interface TagObject { }
    export interface ExternalDocumentationObject { }
    export interface ContactObject {
        /**
         *The identifying name of the contact person/ organization.
         */
        name?: string;
        /**
         *The URL pointing to the contact information.MUST be in the format of a URL.
         */
        url?: string;
        /**
         *The email address of the contact person / organization.MUST be in the format of an email address.
         */
        email?: string;
    }
    export interface LicenseObject {
        /**
         *Required. The license name used for the API.
         */
        name?: string;
        /**
         *A URL to the license used for the API.MUST be in the format of a URL.}
         */
        url?: string;
    }
}