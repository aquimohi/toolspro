import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Home, 
  Car, 
  Calculator, 
  DollarSign, 
  Percent, 
  Clock, 
  Sparkles,
  PieChart
} from 'lucide-react';
import { ToolId } from '../types';

interface CalculatorToolsProps {
  toolId: 'age-calculator' | 'home-loan-calc' | 'car-loan-calc';
}

export const CalculatorTools: React.FC<CalculatorToolsProps> = ({ toolId }) => {
  // Age Calc State
  const [birthDate, setBirthDate] = useState('1998-05-15');

  // Home Loan State
  const [homeLoanAmount, setHomeLoanAmount] = useState<number>(350000);
  const [homeInterestRate, setHomeInterestRate] = useState<number>(6.5);
  const [homeTenureYears, setHomeTenureYears] = useState<number>(20);

  // Car Loan State
  const [carPrice, setCarPrice] = useState<number>(32000);
  const [carDownPayment, setCarDownPayment] = useState<number>(5000);
  const [carInterestRate, setCarInterestRate] = useState<number>(5.9);
  const [carTenureMonths, setCarTenureMonths] = useState<number>(60);

  // 1. Age Calculation Engine
  const ageData = useMemo(() => {
    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffMs = today.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (today > nextBday) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Zodiac Sign
    const month = birth.getMonth() + 1;
    const day = birth.getDate();
    let zodiac = 'Aries';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiac = 'Aquarius';
    else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) zodiac = 'Pisces';
    else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiac = 'Aries';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiac = 'Taurus';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiac = 'Gemini';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiac = 'Cancer';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiac = 'Leo';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiac = 'Virgo';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiac = 'Libra';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiac = 'Scorpio';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiac = 'Sagittarius';
    else zodiac = 'Capricorn';

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNextBday,
      zodiac,
      dayOfWeek: birth.toLocaleDateString('en-US', { weekday: 'long' }),
    };
  }, [birthDate]);

  // 2. Home Loan EMI Math
  const homeLoanResult = useMemo(() => {
    const P = homeLoanAmount;
    const r = homeInterestRate / 12 / 100;
    const n = homeTenureYears * 12;

    if (r === 0) return { emi: P / n, totalInterest: 0, totalPayment: P };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPct: Math.round((P / totalPayment) * 100),
      interestPct: Math.round((totalInterest / totalPayment) * 100),
    };
  }, [homeLoanAmount, homeInterestRate, homeTenureYears]);

  // 3. Car Loan EMI Math
  const carLoanResult = useMemo(() => {
    const P = Math.max(0, carPrice - carDownPayment);
    const r = carInterestRate / 12 / 100;
    const n = carTenureMonths;

    if (r === 0) return { emi: P / n, totalInterest: 0, totalPayment: P, financed: P };

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      financed: P,
    };
  }, [carPrice, carDownPayment, carInterestRate, carTenureMonths]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* 1. Age Calculator */}
      {toolId === 'age-calculator' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Exact Age & Milestone Calculator</h2>
              <p className="text-xs text-slate-500">Calculate exact years, months, days, hours lived & countdown to next birthday</p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full p-2.5 text-xs md:text-sm font-semibold border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {ageData && (
            <div className="flex flex-col gap-4">
              {/* Primary Age Banner */}
              <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Your Exact Age</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-indigo-950 mt-1">
                    {ageData.years} <span className="text-lg font-medium text-slate-600">years</span> {ageData.months} <span className="text-lg font-medium text-slate-600">months</span> {ageData.days} <span className="text-lg font-medium text-slate-600">days</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-2.5 rounded-xl border border-indigo-200 shadow-2xs text-xs">
                  <span className="text-slate-500 block">Next Birthday in:</span>
                  <strong className="text-indigo-600 text-sm">{ageData.daysToNextBday} days</strong>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Total Days Lived</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">{ageData.totalDays.toLocaleString()}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Total Hours</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">{ageData.totalHours.toLocaleString()}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Zodiac Sign</span>
                  <div className="text-base font-bold text-indigo-600 mt-0.5">{ageData.zodiac}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Born on</span>
                  <div className="text-base font-bold text-slate-800 mt-0.5">{ageData.dayOfWeek}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Home Loan EMI Calculator */}
      {toolId === 'home-loan-calc' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Home Loan EMI & Mortgage Calculator</h2>
              <p className="text-xs text-slate-500">Estimate monthly payments, total interest burden & amortization schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Home Loan Amount ($)</span>
                  <span className="text-indigo-600">${homeLoanAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="10000"
                  value={homeLoanAmount}
                  onChange={e => setHomeLoanAmount(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Interest Rate (% per annum)</span>
                  <span className="text-indigo-600">{homeInterestRate}%</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="15.0"
                  step="0.1"
                  value={homeInterestRate}
                  onChange={e => setHomeInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Loan Tenure (Years)</span>
                  <span className="text-indigo-600">{homeTenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="1"
                  value={homeTenureYears}
                  onChange={e => setHomeTenureYears(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Monthly EMI Payment</span>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">
                  ${homeLoanResult.emi.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Principal Amount:</span>
                  <div className="font-bold text-slate-800">${homeLoanAmount.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Total Interest:</span>
                  <div className="font-bold text-amber-600">${homeLoanResult.totalInterest.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-indigo-950">Total Payment:</span>
                <strong className="text-indigo-700 font-extrabold text-sm">${homeLoanResult.totalPayment.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Car Loan Calculator */}
      {toolId === 'car-loan-calc' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Auto & Car Loan EMI Calculator</h2>
              <p className="text-xs text-slate-500">Calculate car payments with down payment offset, interest rate & loan duration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Vehicle Price ($)</span>
                  <span className="text-indigo-600">${carPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="1000"
                  value={carPrice}
                  onChange={e => setCarPrice(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Down Payment ($)</span>
                  <span className="text-indigo-600">${carDownPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={carPrice}
                  step="500"
                  value={carDownPayment}
                  onChange={e => setCarDownPayment(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Interest Rate (% per year)</span>
                  <span className="text-indigo-600">{carInterestRate}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="18.0"
                  step="0.1"
                  value={carInterestRate}
                  onChange={e => setCarInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Loan Term (Months)</span>
                  <span className="text-indigo-600">{carTenureMonths} Months ({carTenureMonths / 12} yrs)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="6"
                  value={carTenureMonths}
                  onChange={e => setCarTenureMonths(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Estimated Monthly Car Payment</span>
                <div className="text-3xl font-extrabold text-indigo-600 mt-1">
                  ${carLoanResult.emi.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200">
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Loan Amount Financed:</span>
                  <div className="font-bold text-slate-800">${carLoanResult.financed.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-slate-500">Total Interest:</span>
                  <div className="font-bold text-amber-600">${carLoanResult.totalInterest.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-xs flex justify-between items-center">
                <span className="font-bold text-indigo-950">Total Out of Pocket:</span>
                <strong className="text-indigo-700 font-extrabold text-sm">${(carLoanResult.totalPayment + carDownPayment).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
