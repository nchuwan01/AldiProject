class employee{
    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get first() {
        return this._first;
    }

    set first(value) {
        this._first = value;
    }

    get last() {
        return this._last;
    }

    set last(value) {
        this._last = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get hiredDate() {
        return this._hiredDate;
    }

    set hiredDate(value) {
        this._hiredDate = value;
    }

    get leaderID() {
        return this._leaderID;
    }

    set leaderID(value) {
        this._leaderID = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        this._role = value;
    }

    get ptoBalance() {
        return this._ptoBalance;
    }

    set ptoBalance(value) {
        this._ptoBalance = value;
    }
    constructor(id, first, last, email, hiredDate, leaderID, role, ptoBalance) {

        this._id = id;
        this._first = first;
        this._last = last;
        this._email = email;
        this._hiredDate = hiredDate;
        this._leaderID = leaderID;
        this._role = role;
        this._ptoBalance = ptoBalance;
    }

    get getVD(){
        return this.ptoBalance.Vacation
    }
    get getPD(){
        return this.ptoBalance.Personal

    }
    get getSD(){
        return this.ptoBalance.Sick

    }
}
module.exports = employee