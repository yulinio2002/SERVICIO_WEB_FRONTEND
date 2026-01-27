import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from "axios";

export default class Api {
	private static _instance: Api | null = null;

	private _basePath: string;
	private _authorization: string | null = null;

	private constructor(basePath: string) {
		this._basePath = basePath;
	}

	public static async getInstance(): Promise<Api> {
		if (!this._instance) {
			const basePath = `http://${import.meta.env.VITE_BASE_URL}:8081`;
			this._instance = new Api(basePath);
		}
		return this._instance;
	}

	/* =====================
     AUTHORIZATION (JWT)
     ===================== */
	public set authorization(value: string | null) {
		this._authorization = value;
	}

	public get authorization(): string | null {
		return this._authorization;
	}

	/* =====================
     CORE REQUEST
     ===================== */
	public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const isFormData =
			typeof FormData !== "undefined" && config.data instanceof FormData;

		// Start from user-provided headers so we can safely override defaults.
		const headers: RawAxiosRequestHeaders = {
			...(config.headers || {}),
		};

		// Default JSON header only when NOT sending FormData.
		// For FormData, the browser/axios must set the boundary automatically.
		if (!isFormData) {
			if (!headers["Content-Type"] && !headers["content-type"]) {
				headers["Content-Type"] = "application/json";
			}
		} else {
			// Remove any forced content-type to avoid breaking multipart boundaries.
			if (headers["Content-Type"]) delete headers["Content-Type"];
			if (headers["content-type"]) delete headers["content-type"];
		}

		if (this._authorization) {
			headers["Authorization"] = `Bearer ${this._authorization}`;
		}

		const configOptions: AxiosRequestConfig = {
			...config,
			baseURL: this._basePath,
			headers,
		};

		const path = this._basePath + (config.url ?? "");

		return axios<RequestType, AxiosResponse<ResponseType>>(path, configOptions);
	}

	/* =====================
     HTTP METHODS
     ===================== */
	public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
		return this.request<RequestType, ResponseType>({
			...config,
			method: "GET",
		});
	}

	public post<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "POST",
			data,
		});
	}

	public put<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "PUT",
			data,
		});
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "PATCH",
			data,
		});
	}

	public delete<ResponseType>(options: AxiosRequestConfig) {
		return this.request<void, ResponseType>({
			...options,
			method: "DELETE",
		});
	}
}
