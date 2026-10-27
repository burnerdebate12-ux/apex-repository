import { useState } from 'react';
import Modal from './Modal';
import Toggle from './Toggle';
import { MAJORS, MINORS, EC_TYPES } from '@/lib/types';
import type { OnboardingSurvey, Major, Minor, EcType, FamilyProfile } from '@/lib/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (survey: OnboardingSurvey) => void;
  initial: OnboardingSurvey | null;
}

export default function OnboardingModal({ open, onClose, onSubmit, initial }: Props) {
  const [form, setForm] = useState<OnboardingSurvey>(
    initial ?? {
      name: '',
      email: '',
      password: '',
      major: 'Undeclared',
      customMajor: '',
      minor: 'None',
      customMinor: '',
      dualMajor: false,
      dualMajorFields: '',
      ecType: 'Research',
      researchFocus: '',
      internshipLocation: '',
      internshipType: '',
      ecSpecifics: '',
      family: {
        householdIncome: 'Under $30k',
        dependents: 1,
        firstGenCollege: false,
        financialNeed: false,
      },
      submitted: false,
    }
  );
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const set = <K extends keyof OnboardingSurvey>(k: K, v: OnboardingSurvey[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const setFamily = <K extends keyof FamilyProfile>(k: K, v: FamilyProfile[K]) =>
    setForm((f) => ({ ...f, family: { ...f.family, [k]: v } }));

  const next = () => {
    setError('');
    if (step === 1) {
      if (!form.name.trim()) return setError('Student name is required.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError('Enter a valid email.');
      if (form.password.length < 4) return setError('Password must be at least 4 characters.');
      if (form.major === 'Other (Self-Insert)' && !form.customMajor.trim()) return setError('Please enter your custom major.');
      if (form.minor === 'Other (Self-Insert)' && !form.customMinor.trim()) return setError('Please enter your custom minor.');
      if (form.dualMajor && !form.dualMajorFields.trim()) return setError('Enter your second major field.');
    }
    if (step === 2) {
      if (form.ecType === 'Research' && !form.researchFocus.trim())
        return setError('Describe your research focus.');
      if (form.ecType === 'Professional/Internship' && (!form.internshipLocation.trim() || !form.internshipType.trim()))
        return setError('Target location and internship type are required.');
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = () => {
    onSubmit({ ...form, submitted: true });
    setStep(1);
    setError('');
  };

  return (
    <Modal open={open} onClose={onClose} title="Apex Colliville Onboarding" maxWidth="max-w-2xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`grid h-7 w-7 place-items-center rounded-full border text-xs font-semibold transition-all ${
                step >= s
                  ? 'border-gold/60 bg-gold/15 text-gold-soft gold-glow'
                  : 'border-ink-border bg-black/40 text-neutral-600'
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`h-px flex-1 ${step > s ? 'bg-gold/50' : 'bg-ink-border'}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-slidein">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Student Name</label>
              <input className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Jordan Avery" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input className="input-field" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@school.edu" />
            </div>
          </div>
          <div>
            <label className="label-field">Password</label>
            <input type="password" className="input-field" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="••••••" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Preferred Major</label>
              <select className="input-field" value={form.major} onChange={(e) => set('major', e.target.value as Major)}>
                {MAJORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {form.major === 'Other (Self-Insert)' && (
                <input
                  className="input-field mt-2 animate-slidein"
                  value={form.customMajor}
                  onChange={(e) => set('customMajor', e.target.value)}
                  placeholder="Type your major…"
                />
              )}
            </div>
            <div>
              <label className="label-field">Preferred Minor</label>
              <select className="input-field" value={form.minor} onChange={(e) => set('minor', e.target.value as Minor)}>
                {MINORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {form.minor === 'Other (Self-Insert)' && (
                <input
                  className="input-field mt-2 animate-slidein"
                  value={form.customMinor}
                  onChange={(e) => set('customMinor', e.target.value)}
                  placeholder="Type your minor…"
                />
              )}
            </div>
          </div>
          <div className="rounded-xl border border-ink-border bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-200">Dual Major</p>
                <p className="text-xs text-neutral-500">Pursuing two majors simultaneously? Enable this to add a second field.</p>
              </div>
              <Toggle on={form.dualMajor} onChange={(v) => set('dualMajor', v)} />
            </div>
            {form.dualMajor && (
              <input
                className="input-field mt-3 animate-slidein"
                value={form.dualMajorFields}
                onChange={(e) => set('dualMajorFields', e.target.value)}
                placeholder="Second major (e.g. Data Science, Economics, Philosophy)"
              />
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 animate-slidein">
          <div>
            <label className="label-field">EC Type</label>
            <div className="flex flex-wrap gap-2">
              {EC_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => set('ecType', t as EcType)}
                  className={`chip ${form.ecType === t ? 'chip-gold' : ''}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {form.ecType === 'Research' && (
            <div className="animate-slidein">
              <label className="label-field">What type of academic research or specific niche focus areas are you drawn to?</label>
              <textarea
                className="input-field min-h-[90px]"
                value={form.researchFocus}
                onChange={(e) => set('researchFocus', e.target.value)}
                placeholder="e.g. computational biology, NLP for low-resource languages, climate modeling..."
              />
            </div>
          )}

          {form.ecType === 'Professional/Internship' && (
            <div className="grid gap-4 animate-slidein sm:grid-cols-2">
              <div>
                <label className="label-field">Target Location</label>
                <select
                  className="input-field"
                  value={form.internshipLocation}
                  onChange={(e) => set('internshipLocation', e.target.value)}
                >
                  <option value="">Select…</option>
                  <option>Remote</option>
                  <option>New York, NY</option>
                  <option>San Francisco, CA</option>
                  <option>Boston, MA</option>
                  <option>Washington, DC</option>
                  <option>Memphis, TN</option>
                  <option>Nashville, TN</option>
                </select>
              </div>
              <div>
                <label className="label-field">Internship Type</label>
                <select
                  className="input-field"
                  value={form.internshipType}
                  onChange={(e) => set('internshipType', e.target.value)}
                >
                  <option value="">Select…</option>
                  <option>Software Engineering</option>
                  <option>Research Lab</option>
                  <option>Business / Finance</option>
                  <option>Policy / Government</option>
                  <option>Biotech</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="label-field">EC Interest Specifics</label>
            <textarea
              className="input-field min-h-[80px]"
              value={form.ecSpecifics}
              onChange={(e) => set('ecSpecifics', e.target.value)}
              placeholder="Clubs, leadership roles, competitions, side projects…"
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5 animate-slidein">
          <div>
            <label className="label-field">Household Income</label>
            <select
              className="input-field"
              value={form.family.householdIncome}
              onChange={(e) => setFamily('householdIncome', e.target.value as FamilyProfile['householdIncome'])}
            >
              <option>Under $30k</option>
              <option>$30k–$60k</option>
              <option>$60k–$100k</option>
              <option>$100k–$150k</option>
              <option>Over $150k</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Number of Dependents</label>
              <input
                type="number"
                min={1}
                className="input-field"
                value={form.family.dependents}
                onChange={(e) => setFamily('dependents', Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
            <div className="flex items-end pb-1">
              <Toggle on={form.family.firstGenCollege} onChange={(v) => setFamily('firstGenCollege', v)} label="First-generation college student" />
            </div>
          </div>
          <div className="rounded-xl border border-ink-border bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-200">Financial Need Criteria</p>
                <p className="text-xs text-neutral-500">Toggles need-based scholarship visibility across the app.</p>
              </div>
              <Toggle on={form.family.financialNeed} onChange={(v) => setFamily('financialNeed', v)} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 flex items-center justify-between">
        <button className="btn-ghost" onClick={back} disabled={step === 1}>
          Back
        </button>
        {step < 3 ? (
          <button className="btn-gold" onClick={next}>
            Continue
          </button>
        ) : (
          <button className="btn-gold" onClick={submit}>
            Submit & Unlock Dashboard
          </button>
        )}
      </div>
    </Modal>
  );
}
