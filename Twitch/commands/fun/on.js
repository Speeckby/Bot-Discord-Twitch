module.exports = {
    name : "on",
    desc : "Oui ou non ?",
    usage : "on",
    example : ["on Es-tu beau ?"],
    aliases : ["on"],

    run : async (client, channel, user, args) => {
        let response;
        let calcul = Math.floor(Math.random() * (8 - 1)) + 1;

        switch (calcul) {
            case 1:
                response = "Oui bien sûr !"
                break;
            case 2:
                response = "Non pas du tout !"
                break;
            case 3:
                response = "Je ne crois pas !"
                break;
            case 4:
                response = "Je sais pas !"
                break;
            case 5:
                response = "À toi de chercher !"
                break;
            case 6:
                response = "Oui c'est évident !"
                break;
            case 7:
                response = "Non mdrr t'as cru ? "
                break;
            default:
                response = "Oui, possible !"
        }
        client.twitch.say(channel, response);
    }
}