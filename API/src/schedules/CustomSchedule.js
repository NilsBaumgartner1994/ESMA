/**
 * This custom Schedule can handle work like renaming things or running tasks once
 */
export default class CustomSchedule {

    /**
     * Constructor for Custom shedule
     * @param logger the logger
     * @param models the sequelize models
     */
    constructor(logger, models) {
        this.logger = logger;
        this.logger.info("[CustomSchedule] initialising");
        this.models = models;
        //this.runCustomMethod();
        this.logger.info("[CustomSchedule] initialised");
    }

    async runCustomMethod(){
        await this.renameMeals();
        await this.renameCanteenMeals();
    }

    padLeadingZero(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    calcTimeLeft(startTime,index,amount){
        let now = new Date();
        let nowInMilli = now.getTime();
        let startInMilli = startTime.getTime();
        let diff = nowInMilli-startInMilli;
        let estimatedTotal = (diff/index)*amount;
        let estimatedDiff = estimatedTotal-diff;
        let esitamtedDiffSeconds = estimatedDiff/1000;
        esitamtedDiffSeconds = parseInt(esitamtedDiffSeconds);

        let seconds = esitamtedDiffSeconds;

        let minuteInSeconds = 60;
        let hourInSeconds = minuteInSeconds * 60;
        let dayInSeconds = hourInSeconds * 24;

        let days = Math.floor(seconds / dayInSeconds); //calc days
        let hours = Math.floor((seconds - days * dayInSeconds) / hourInSeconds); //calc hours
        let minutes = Math.floor(
            (seconds - (hours * hourInSeconds + days * dayInSeconds)) / minuteInSeconds
        ); //calc minutes
        let sinceSeconds = seconds % 60; //calc remeining seconds
        return (
            days +
            " " +
            this.padLeadingZero(hours, 2) +
            ":" +
            this.padLeadingZero(minutes, 2) +
            ":" +
            this.padLeadingZero(sinceSeconds, 2)
        );


    }

    async renameCanteenMeals(){
        let startTime = new Date();
        let allCanteenMeals = await this.models.CanteenMeal.findAll();
        let amount = allCanteenMeals.length;
        for(let i=0; i<amount; i++){
            const canteenMeal = allCanteenMeals[i];
            await this.renameCanteenMeal(canteenMeal,i,amount,startTime);
        }
    }

    async renameCanteenMeal(canteenMeal,index,amount,startTime){
        let timeLeft = this.calcTimeLeft(startTime,index,amount);

        const meal = await canteenMeal.getMeal();
        if(!!meal){
            const englisch = meal.nameEng;
            if(!!englisch){
                console.log("Rename Canteen Meal ("+(index+1)+"/"+amount+") ["+timeLeft+"]: "+canteenMeal.date+" "+meal.name+" --> "+englisch);
                let toUpdate = await this.models.CanteenMeal.findOne({where: {date: canteenMeal.date, MealId: canteenMeal.MealId, CanteenId: canteenMeal.CanteenId}});
                //DONT try to update canteenMeal itself ! Why ever
                await toUpdate.update({
                    displayNameEng: ""+englisch
                });
            }
        }
    }

    async renameMeals(){
        let allMeals = await this.models.Meal.findAll();
        let startTime = new Date();
        let amount = allMeals.length;
        for(let i=0; i<amount; i++){
            let meal = allMeals[i];
            await this.renameMeal(meal,i,amount,startTime);
        }
    }

    async renameMeal(Meal,index,amount,startTime){
        let name = Meal.name;
        let foodtag = Meal.foodtag;
        if(foodtag==="f"){ //fresh is now active
            foodtag = "a";
        }
        if(foodtag==="l"){ //local is now classic
            foodtag = "c";
        }

        let timeLeft = this.calcTimeLeft(startTime,index,amount);
        console.log("Rename Meal ("+(index+1)+"/"+amount+") ["+timeLeft+"]: "+name);

        let text1Eng = Meal.text1Eng;
        let text2Eng = Meal.text2Eng;
        let text3Eng = Meal.text3Eng;
        let text4Eng = Meal.text4Eng;
        let text5Eng = Meal.text5Eng;
        let text6Eng = Meal.text6Eng;
        let nameParts = [
            text1Eng,
            text2Eng,
            text3Eng,
            text4Eng,
            text5Eng,
            text6Eng,
        ];
        let englischName = "";
        for (let i = 0; i < nameParts.length; i++) {
            let partialName = nameParts[i];
            englischName += partialName.replace(/ \(.*/g, ""); //remove all stupid (1,3,) stuff

            if (
                i < nameParts.length - 1 && //if thats not the last
                partialName !== "" && //if there is something
                nameParts[i + 1] !== "" //and next is not empty
            ) {
                englischName += ", "; //concat with a ,
            }
        }
        await Meal.update({
            nameEng: englischName,
            foodtag: foodtag
        });
    }
}
