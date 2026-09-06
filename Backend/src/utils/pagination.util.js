const getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

const paginatedResponse = (data, totalCount, page, limit) => ({
  data,
  totalCount,
  page,
  totalPages: Math.ceil(totalCount / limit) || 1,
});

module.exports = { getPagination, paginatedResponse };
