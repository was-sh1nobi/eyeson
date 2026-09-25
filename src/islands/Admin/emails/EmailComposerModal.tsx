import { X, Send, Variable, Loader2 } from "lucide-react";
import type { EmailRequest } from "./types";
import { LOG_PREFIX } from "./types";

interface EmailComposerModalProps {
  show: boolean;
  onClose: () => void;
  selectedRequests: EmailRequest[];
  subject: string;
  onSubjectChange: (value: string) => void;
  body: string;
  onBodyChange: (value: string) => void;
  sending: boolean;
  onSend: () => void;
}

const TEMPLATE_VARIABLES = [
  { label: "First Name", value: "{{firstName}}" },
  { label: "Last Name", value: "{{lastName}}" },
  { label: "Full Name", value: "{{fullName}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Company", value: "{{companyName}}" },
  { label: "Project Type", value: "{{projectType}}" },
  { label: "Budget", value: "{{budget}}" },
  { label: "Phone", value: "{{phone}}" },
];

export default function EmailComposerModal({
  show,
  onClose,
  selectedRequests,
  subject,
  onSubjectChange,
  body,
  onBodyChange,
  sending,
  onSend,
}: EmailComposerModalProps) {
  const recipientsWithEmail = selectedRequests.filter((r) => r.email);
  const recipientsWithoutEmail = selectedRequests.filter((r) => !r.email);

  return (
      <> {show && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            if (!sending) {
              console.log(`${LOG_PREFIX} [UI] Composer modal backdrop clicked - closing`);
              onClose();
            } else {
              console.log(`${LOG_PREFIX} [UI] Composer modal backdrop clicked - ignored (sending in progress)`);
            }
          }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#021617] p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-white">Compose Email</h3>
                <p className="text-sm text-white/50 mt-0.5">
                  Sending to <span className="text-white/80 font-medium">{recipientsWithEmail.length}</span> recipient(s)
                  {recipientsWithoutEmail.length > 0 && (
                    <span className="text-amber-400/60 ml-1">
                      ({recipientsWithoutEmail.length} without email - excluded)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!sending) {
                    console.log(`${LOG_PREFIX} [UI] Composer modal X button clicked - closing`);
                    onClose();
                  } else {
                    console.log(`${LOG_PREFIX} [UI] Composer modal X button clicked - ignored (sending in progress)`);
                  }
                }}
                className="text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-5">
              <label className="block text-sm text-white/70 mb-2">Recipients</label>
              <div className="rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5">
                        <th className="text-left px-3 py-2 text-white/40 font-medium">Name</th>
                        <th className="text-left px-3 py-2 text-white/40 font-medium">Email</th>
                        <th className="text-left px-3 py-2 text-white/40 font-medium hidden sm:table-cell">Company</th>
                        <th className="text-left px-3 py-2 text-white/40 font-medium hidden md:table-cell">Type</th>
                        <th className="text-left px-3 py-2 text-white/40 font-medium hidden md:table-cell">Budget</th>
                        <th className="text-left px-3 py-2 text-white/40 font-medium hidden lg:table-cell">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recipientsWithEmail.map((r) => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-3 py-2.5 text-white/80 whitespace-nowrap">
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="px-3 py-2.5 text-white/60">{r.email}</td>
                          <td className="px-3 py-2.5 text-white/50 hidden sm:table-cell">{r.companyName || "-"}</td>
                          <td className="px-3 py-2.5 text-white/50 hidden md:table-cell">
                            {r.projectType && (
                              <span className="px-1.5 py-0.5 rounded bg-[#00E6D7]/10 text-[#00E6D7]/70 text-[10px]">
                                {r.projectType}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-white/50 hidden md:table-cell">{r.budget || "-"}</td>
                          <td className="px-3 py-2.5 text-white/50 hidden lg:table-cell">{r.phone || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-white/70">Template Variables</label>
                <span className="text-[10px] text-white/30">Click to insert into message</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TEMPLATE_VARIABLES.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => {
                      console.log(`${LOG_PREFIX} [UI] Template variable "${v.value}" clicked - inserting into ${body.length > 0 ? 'end of body' : 'body'}`);
                      onBodyChange(body + v.value);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/50 hover:text-white/80 hover:border-white/20 transition-colors cursor-pointer"
                    title={v.value}
                  >
                    <Variable size={10} />
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-1.5">Subject</label>
              <input
                value={subject}
                onChange={(e) => onSubjectChange(e.target.value)}
                placeholder="Enter email subject... (e.g., Re: Your {{projectType}} inquiry)"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow]"
              />
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm text-white/70">Message</label>
                <span className="text-[10px] text-white/30">{body.length} characters</span>
              </div>
              <textarea
                value={body}
                onChange={(e) => onBodyChange(e.target.value)}
                placeholder="Write your email message here... (HTML supported)

Tip: Use template variables like {{firstName}} to personalize."
                rows={8}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6D7]/30 focus:border-[#00E6D7]/30 transition-[border-color,box-shadow] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  console.log(`${LOG_PREFIX} [UI] Composer modal Cancel button clicked`);
                  onClose();
                }}
                disabled={sending}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onSend}
                disabled={sending || !subject.trim() || !body.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6D7] to-[#12ACB5] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    
  </>
  );
}
