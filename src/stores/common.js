import { defineStore } from "pinia";
import { ref, computed } from "vue";
import $api from "@/utils/axios";

export const useCommonStore = defineStore("common", () => {
    const items = ref([]);

    const createItem = async (payload) => {
        return new Promise((resolve, reject) => {
            $api
                .post(modelUrl, payload)
                .then(response => {
                    const { data } = response;
                    if (data.statusCode === '200') {
                        allItems.value = allItems.value.concat(data.responseData);
                    }
                    return resolve(response);
                })
                .catch(error => reject(error));
        });
    };

    const applyCode = async (payload) => {
        const formData = new FormData();
        formData.append('code', payload);
        return new Promise((resolve, reject) => {
            $api
                .post(`/subscription/apply-code`, formData)
                .then(response => {
                    const { data } = response;
                    if (data.statusCode === '200') {
                        allItems.value = allItems.value.concat(data.responseData);
                    }
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    };

    const applyPromoCode = async (payload) => {
        const formData = new FormData();
        formData.append('code', payload);
        return new Promise((resolve, reject) => {
            $api
                .post(`/subscription/apply-promo-code`, formData)
                .then(response => {
                    const { data } = response;
                    return resolve(data);
                })
                .catch(error => reject(error));
        });
    };

    const getItems = async () => {
        return new Promise((resolve, reject) => {
            $api
                .get(modelUrl)
                .then(response => {
                    const { data } = response;
                    if (data.statusCode === '200') {
                        allItems.value = data.responseData;
                        isLoaded.value = true;
                    }
                    return resolve(response);
                })
                .catch(error => reject(error));
        });
    };

    const deleteItem = async (ctx, uuid) => {
        return new Promise((resolve, reject) => {
            $api
                .delete(`${modelUrl}/${uuid}`)
                .then(response => {
                    const { data } = response;
                    if (data.statusCode === '200') {
                        ctx.commit("removeItem", uuid);
                    }
                    return resolve(response);
                })
                .catch(error => reject(error));
        });
    };

    return {
        allItems,
        isLoaded,
        createItem,
        applyCode,
        applyPromoCode,
        getItems,
        deleteItem,
    };
});
