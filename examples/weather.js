import { evaluate, and, or, explain, not, filter } from '../lib/regent.min';

// An example of using Regent without custom predicates

const data = {
  precipitation: ['rain'],
  temperature: 78,
};

const IS_RAINING = { left: '@precipitation', fn: 'includes', right: 'rain' };
const NOT_RAINING = not(IS_RAINING);
const IS_SNOWING = { left: '@precipitation', fn: 'includes', right: 'snow' };
const NOT_SNOWING = not(IS_SNOWING);
const IS_COLD = { left: '@temperature', fn: 'lessThan', right: 75 };
const IS_WARM = not(IS_COLD);
const NO_PRECIPITATION = and([NOT_RAINING, NOT_SNOWING]);

const SHOULD_WEAR_COAT = or([IS_RAINING, IS_SNOWING, IS_COLD]);


evaluate(data, SHOULD_WEAR_COAT); /* ? */ // true
explain(SHOULD_WEAR_COAT, data); /* ? */
/* SHOULD OUTPUT
​​​​​(
  (@precipitation->["rain"] includes "rain") or
  (@precipitation->["rain"] includes "snow") or
  (@temperature->78 lessThan 75)
)​​​​​
*/

const clothingLogic = [
  { value: ['hat', 'scarf', 'boots'], rules: [IS_COLD] },
  { value: ['sandals', 't-shirt'], rules: [IS_WARM] },
  { value: ['sunglasses'], rules: [NO_PRECIPITATION] },
  { value: ['umbrella'], rules: [IS_RAINING] },
];

const myClothing = filter(data, clothingLogic);
const clothing = myClothing.reduce((acc, row) => (
  acc.concat(row.value)
), []);

console.log(clothing); // ['sandals', 't-shirt', 'umbrella']
