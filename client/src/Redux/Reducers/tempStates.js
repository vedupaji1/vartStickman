import {
    createReducer
} from "@reduxjs/toolkit";

export const dashboardData = createReducer({
    data: null
}, {
    setDashboardData: (state, action) => {
        state.data = action.payload;
    }
})

export const searchedNFTData = createReducer({
    data: null
}, {
    setSearchedNFTData: (state, action) => {
        state.data = action.payload;
    }
})

export const isMetamask = createReducer({
    data: null
}, {
    setIsMetamask: (state, action) => {
        state.data = action.payload;
    }
})

export const isLoading = createReducer({
    data: true
}, {
    setIsLoading: (state, action) => {
        state.data = action.payload;
    }
})

export const curParameter = createReducer({
    data: null
}, {
    setCurParameter: (state, action) => {
        state.data = action.payload;
    }
})

export const curUserAddress = createReducer({
    data: null
}, {
    setCurUserAddress: (state, action) => {
        state.data = action.payload;
    }
})