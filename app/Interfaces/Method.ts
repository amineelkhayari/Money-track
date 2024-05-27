// Sample sales data
export const coupage = (data: any[], groupeBy: string, userId: string) => {
  const uniqueDates = [...new Set(data.map(item => item[groupeBy]))];
  // Prepare data for FlatList
  console.log("");
  const groupedData = uniqueDates.map(date => ({
    date,
    data: data.filter(item => item[groupeBy] === date),
  }));
  groupedData.map((doc: any) => {
    var dt = CalculateExpense(doc.data, userId);
    doc['exp'] = dt;
  })
  return groupedData;
}

export const coupageGeneric = (data: any[], groupeBy: string) => {
  const uniqueDates = [...new Set(data.map(item => item[groupeBy]))];
  // Prepare data for FlatList
  const groupedData = uniqueDates.map(date => {
    var dt = data.filter(item => item[groupeBy] === date);
    var group = dt.map(item => (item.amount / item.participants.length)).reduce((acc, curr) => acc + curr, 0);
    return {
      date,
      data: dt,
      exp: group.toFixed(2)
    }
  }); 
  return groupedData;
}

const CalculateExpense = (data: Expense[], userId: string) => {
  let totalDebt = 0;
  let totleExpense = 0;
  let totalCredit = 0;

  data.forEach((doc: Expense) => {
    const expense = doc;
    const amount = expense.amount;
    const paidBy = expense.paidBy;
    // Calculate Mohammed's share in the expense
    const participants = expense.participants;
    const numParticipants = participants.length;
    const share = amount / numParticipants;
    // If Mohammed is the payer, he's owed by other participants
    // If Mohammed is not the payer, he owes the payer
    if (paidBy === userId) {
      totleExpense += amount;
      participants.forEach((participant: Participants) => {
        if (participant.Value !== userId && !participant.Payed) {
          totalCredit += share;
        }
        else if (participant.Value !== userId && participant.Payed) {
          totleExpense -= share;
        }
      });
    } else {
      participants.forEach((participant: Participants) => {
        if (participant.Value == userId && !participant.Payed) {
          totalDebt += share;
        } else if (participant.Value == userId && participant.Payed)
          totleExpense += share;
      });
    }
  })
  var res = {
    "Expense": totleExpense.toFixed(2),
    "Credit": totalCredit.toFixed(2),
    "Debts": totalDebt.toFixed(2)
  }
  // console.log(date,res)
  return res;
}

export const convertDate = (newdt: any) => {
  var parts = newdt.split("/"); // Split the string into parts
  if (parts.length !== 3 || parts.some(isNaN)) {
    return newdt;
}else{
// Format the date as "YYYY-MM-DD"
var formattedDate = parts[2] + "-" + parts[0].padStart(2, '0') + "-" + parts[1].padStart(2, '0');
// Create a new Date object from the formatted date string
var dateObject = new Date(formattedDate);
return dateObject.toDateString(); //new Date(""+newdt).toDateString();
}
  
}

export const getFirstAndLastDayOfMonth = (month:number, year:number) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 1);
  return { firstDay, lastDay };
};