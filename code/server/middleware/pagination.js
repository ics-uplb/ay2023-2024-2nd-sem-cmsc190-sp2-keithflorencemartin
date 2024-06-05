const getPagination = async (model, page, limit, options) => {
  try {
    const offset = (page - 1) * limit;
    const data = await model.findAll({
      offset,
      limit,
      ...options,
    });

    const totalCount = await model.count();
    const totalPages = Math.ceil(totalCount / limit);

    const paginationInfo = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalCount,
    };

    return { data, paginationInfo };
  } catch (error) {
    throw error;
  }
};

module.exports = { getPagination };
