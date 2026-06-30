import { BaseCard } from "../common/BaseCard";
import { Select } from "../forms/Select";
import { TextArea } from "../forms/TextArea";

const questions = [
  "Why are you researching this company today?",
  "What is the strongest bull case?",
  "What is the biggest risk?",
  "What will you do if the thesis is wrong?",
];

export function DecisionChecklist() {
  return (
    <BaseCard>
      <div className="grid grid-cols-2 gap-4">
        {questions.map((question, index) => {
          const id = `decision-question-${index + 1}`;
          return (
            <label className="text-sm font-medium" htmlFor={id} key={id}>
              Question {index + 1}
              <span className="mt-1 block text-xs font-normal text-[#9CA3AF]">
                {question}
              </span>
              <TextArea
                aria-label={`Question ${index + 1}`}
                className="mt-2"
                id={id}
              />
            </label>
          );
        })}
      </div>
      <label
        className="mt-4 block text-sm font-medium"
        htmlFor="decision-select"
      >
        Question 5
        <span className="mt-1 block text-xs font-normal text-[#9CA3AF]">
          What is today&apos;s decision?
        </span>
        <Select
          aria-label="Question 5"
          className="mt-2"
          defaultValue=""
          id="decision-select"
        >
          <option disabled value="">
            Select a decision
          </option>
          <option value="Buy">Buy</option>
          <option value="Hold">Hold</option>
          <option value="Sell">Sell</option>
          <option value="Watch">Watch</option>
        </Select>
      </label>
    </BaseCard>
  );
}
