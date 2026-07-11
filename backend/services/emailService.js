const getReports = async (req, res) => {

    res.status(200).json({
        success: true,
        message: "Reports API working successfully.",
        data: []
    });

};

module.exports = {
    getReports
};