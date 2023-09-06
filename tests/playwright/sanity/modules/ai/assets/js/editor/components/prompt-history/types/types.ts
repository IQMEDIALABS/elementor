type Image = {
	seed: number
	image_url: string
}

export type PromptHistoryItem = {
	elementorApiId: string
	url: string
	type: string
	action: string
	request: {
		prompt: string
	}
	response: {
		results: {
			text?: string,
			images?: Image[],
		}
	}
	createdAt: string
	isFavorite: boolean
}

type PromptHistoryMeta = {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
	allowedDays: number
}

type PromptHistoryPaginationData = {
	items: PromptHistoryItem[]
	meta: PromptHistoryMeta
}

export type PromptHistoryResponseData = {
	success: boolean
	code: number
	data: PromptHistoryPaginationData | string | any[]
}
