// imports
const { default: axios } = require('axios');
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;

// constants
const GET_TODOS_REQUEST = 'GET_TODOS_REQUEST';
const GET_TODOS_SUCCESS = 'GET_TODOS_SUCCESS';
const GET_TODOS_FAILED = 'GET_TODOS_FAILED';
const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// initial states
const initialTodosState = {
    todos: [],
    isLoading: false,
    error: null
}

// actions
const todosRequestAction = () => {
    return {
        type: GET_TODOS_REQUEST
    }
}

const todosSuccessAction = (todos) => {
    return {
        type: GET_TODOS_SUCCESS,
        payload: todos
    }
}

const todosFailedAction = (error) => {
    return {
        type: GET_TODOS_FAILED,
        payload: error
    }
}

// reducers
const todosReducer = (state = initialTodosState, action) => {
    switch (action.type) {
        case GET_TODOS_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case GET_TODOS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                todos: action.payload
            };
        case GET_TODOS_FAILED:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };    
        default:
            return state;
    }
}
// redux-thunk (middleware)
const fetchData = () => {
    return (dispatch) => {
        dispatch(todosRequestAction);
        axios.get(API_URL)
        .then( res => {
            const todos = res.data;
            const titles = todos.map ( todo => todo.title);
            dispatch(todosSuccessAction(titles));
        })
        .catch( error => {
            const errorMessage = error.message;
            dispatch(todosFailedAction(errorMessage));
        })
    }
}

// store
const store = createStore(todosReducer, applyMiddleware(thunk));

store.subscribe( () => {
    console.log(store.getState());
});

store.dispatch(fetchData());
