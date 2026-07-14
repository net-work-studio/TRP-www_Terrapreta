type RequiredRule<TRule> = {
  error(message: string): TRule;
  required(): TRule;
};

export function requiredField(message: string) {
  return <TRule extends RequiredRule<TRule>>(rule: TRule) => [
    rule.required().error(message),
  ];
}
