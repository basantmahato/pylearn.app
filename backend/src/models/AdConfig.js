const mongoose = require('mongoose');

const AdConfigSchema = new mongoose.Schema({
    adsEnabled: {
        type: Boolean,
        default: false
    },
    androidAppId: {
        type: String,
        default: "ca-app-pub-3940256099942544~3347511713" // test id by default
    },
    bannerId: {
        type: String,
        default: "ca-app-pub-3940256099942544/6300978111" // test id by default
    },
    interstitialId: {
        type: String,
        default: "ca-app-pub-3940256099942544/1033173712" // test id by default
    },
    rewardedId: {
        type: String,
        default: "ca-app-pub-3940256099942544/5224354917" // test id by default
    },
    rewardedInterstitialId: {
        type: String,
        default: "ca-app-pub-3940256099942544/5354046379" // test id by default
    },
    appOpenId: {
        type: String,
        default: "ca-app-pub-3940256099942544/9257395921" // test id by default
    }
}, { timestamps: true });

module.exports = mongoose.model('AdConfig', AdConfigSchema);
