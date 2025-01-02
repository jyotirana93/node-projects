const handleCreateId = (dataList) => {
  let newUserId;
  if (!dataList.length) {
    newUserId = dataList.length + 1;
  } else if (dataList.length === 1) {
    const extractedId = dataList.map((data) => data.id || data.userId)[0];
    newUserId = extractedId + 1;
  } else if (dataList.length > 1) {
    const extractedId = dataList.map((data) => data.id || data.userId)[
      dataList.length - 1
    ];
    newUserId = extractedId + 1;
  }

  return newUserId;
};

module.exports = handleCreateId;
