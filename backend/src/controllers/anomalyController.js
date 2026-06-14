const anomalyReviewService = require('../services/anomalyReviewService');

exports.approve = async (req, res, next) => {
  try {
    const anomalyId = parseInt(req.params.id, 10);
    const result = await anomalyReviewService.approveAnomaly(anomalyId, req.user.userId);
    res.status(200).json({ message: 'Anomaly approved and processed', anomaly: result });
  } catch (err) {
    next(err);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const anomalyId = parseInt(req.params.id, 10);
    const result = await anomalyReviewService.rejectAnomaly(anomalyId, req.user.userId);
    res.status(200).json({ message: 'Anomaly rejected', anomaly: result });
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const anomalyId = parseInt(req.params.id, 10);
    const editedData = req.body.editedData;
    const result = await anomalyReviewService.editAndApproveAnomaly(anomalyId, editedData, req.user.userId);
    res.status(200).json({ message: 'Anomaly edited and approved', anomaly: result });
  } catch (err) {
    next(err);
  }
};
