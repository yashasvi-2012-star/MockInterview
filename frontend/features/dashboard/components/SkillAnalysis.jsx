import Card from '../../../shared/components/ui/Card.jsx';

export default function SkillAnalysis({ skills }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-950">Skill Analysis</h2>
      <div className="mt-5 space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{skill.name}</span>
              <span className="font-semibold text-slate-900">{skill.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-brand-600" style={{ width: `${skill.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
