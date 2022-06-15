import dummyData from './data';

const getData = (page, per_page) => {
    const data = {
        page: page,
        total: dummyData.length
    };
    data.totalPages = Math.ceil(dummyData.length/per_page);
    const check = page*per_page+per_page;
    data['data'] = dummyData.slice(page*per_page,(check < dummyData.length ? check : dummyData.length));
    return data;
}

export {
    getData
}